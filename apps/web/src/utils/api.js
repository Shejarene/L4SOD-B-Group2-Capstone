import { supabase } from './supabase'
import router from '../router'

const success = (data, meta = {}) => ({ success: true, data, meta })
const error = (message) => ({ success: false, message })

const api = {
  async get(path, { params } = {}) {
    try {
      const [base, id] = path.replace(/^\//, '').split('/').slice(0, 2)
      const table = baseMap[base] || base

      if (base === 'auth' && id === 'profile') {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return error('Not authenticated')
        const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
        return success(profile || user)
      }

      if (base === 'auth' && path.includes('/invites/verify/')) {
        const token = path.split('/').pop()
        const { data, error: err } = await supabase.rpc('verify_invite_token', { p_token: token })
        if (err) throw err
        if (!data || data.length === 0) return error('Invalid or expired invite')
        return success({ success: true, data: data[0] })
      }

      if (base === 'auth' && path.includes('/invites/accept/')) {
        const token = path.split('/').pop()
        const { error: err } = await supabase.rpc('accept_invite', { p_token: token })
        if (err) throw err
        return success({ success: true })
      }

      if (base === 'dashboard') {
        return await getDashboardStats(id)
      }

      let query = supabase.from(table).select('*', { count: 'exact' })

      if (id && id !== 'my-reports') {
        query = query.eq('id', id)
      }

      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== '' && key !== 'page' && key !== 'perPage') {
            query = query.eq(key, val)
          }
        })
      }

      if (params?.page && params?.perPage) {
        const from = (params.page - 1) * params.perPage
        const to = from + params.perPage - 1
        query = query.range(from, to)
      }

      const { data, count, error: err } = await query
      if (err) throw err

      if (id && id !== 'my-reports') {
        return success(data?.[0] || null)
      }

      if (base === 'lost-items' && id === 'my-reports') {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: myData } = await supabase.from('lost_items').select('*').eq('reporter_id', user?.id)
        return success(myData || [])
      }

      return success(data || [], { total: count || 0 })
    } catch (err) {
      return error(err.message)
    }
  },

  async post(path, body) {
    try {
      const [base] = path.replace(/^\//, '').split('/')
      const table = baseMap[base] || base

      if (base === 'auth') {
        return error('Use Supabase auth directly')
      }

      if (base === 'marks' && body?.entries) {
        const { data, error: err } = await supabase.from('marks').insert(body.entries)
        if (err) throw err
        return success(data)
      }

      if (base === 'attendance' && body?.entries) {
        const { data, error: err } = await supabase.from('attendance').insert(body.entries)
        if (err) throw err
        return success(data)
      }

      if (base === 'login-requests') {
        const { data, error: err } = await supabase.rpc('create_access_request', {
          p_email: body.email,
          p_role: body.requestedRole,
          p_first_name: body.firstName,
          p_last_name: body.lastName,
          p_phone: body.phone,
          p_reason: body.reason,
        })
        if (err) throw err
        return success(data)
      }

      if (base === 'invites') {
        const { data, error: err } = await supabase.rpc('create_admin_invite', {
          p_email: body.email || '',
          p_role: body.role,
          p_token: body.token || crypto.randomUUID(),
        })
        if (err) throw err
        return success(data)
      }

      const { data: { user } } = await supabase.auth.getUser()
      const insertData = { ...body, reporter_id: user?.id, created_by: user?.id }

      const { data, error: err } = await supabase.from(table).insert(insertData).select()
      if (err) throw err
      return success(data?.[0])
    } catch (err) {
      return error(err.message)
    }
  },

  async put(path, body) {
    try {
      const [base, id] = path.replace(/^\//, '').split('/')
      const table = baseMap[base] || base

      const { data, error: err } = await supabase.from(table).update(body).eq('id', id).select()
      if (err) throw err
      return success(data?.[0])
    } catch (err) {
      return error(err.message)
    }
  },

  async delete(path) {
    try {
      const [base, id] = path.replace(/^\//, '').split('/')
      const table = baseMap[base] || base

      const { error: err } = await supabase.from(table).delete().eq('id', id)
      if (err) throw err
      return success(null)
    } catch (err) {
      return error(err.message)
    }
  },
}

const baseMap = {
  'students': 'students',
  'teachers': 'teachers',
  'classes': 'classes',
  'classrooms': 'classrooms',
  'subjects': 'subjects',
  'exams': 'exams',
  'marks': 'marks',
  'attendance': 'attendance',
  'fees': 'fees',
  'fee-structures': 'fee_structures',
  'payments': 'payments',
  'discipline': 'discipline_records',
  'timetable': 'timetable',
  'communication': 'messages',
  'announcements': 'announcements',
  'lost-items': 'lost_items',
  'login-requests': 'invites',
  'users': 'users',
  'invites': 'invites',
  'reports': 'reports',
}

async function getDashboardStats(section) {
  const [
    { count: studentCount },
    { count: teacherCount },
    { count: classCount },
    { count: userCount },
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('teachers').select('*', { count: 'exact', head: true }),
    supabase.from('classes').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
  ])

  return success({
    totalStudents: studentCount || 0,
    totalTeachers: teacherCount || 0,
    totalClasses: classCount || 0,
    totalUsers: userCount || 0,
  })
}

export default api
