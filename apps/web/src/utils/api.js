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
        const { data: profile } = await supabase.from('Users').select('*').eq('id', user.id).single()
        return success(profile || user)
      }

      if (base === 'auth' && path.includes('/invites/verify/')) {
        const token = path.split('/').pop()
        const { data, error: err } = await supabase.from('Invites').select('*').eq('token', token).eq('used', false).single()
        if (err) throw err
        return success({ success: true, data })
      }

      if (base === 'auth' && path.includes('/invites/accept/')) {
        const token = path.split('/').pop()
        const { error: err } = await supabase.from('Invites').update({ used: true, usedAt: new Date().toISOString() }).eq('token', token)
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
        const { data: myData } = await supabase.from('LostItems').select('*').eq('reportedBy', user?.id)
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
        const { data, error: err } = await supabase.from('Marks').insert(body.entries)
        if (err) throw err
        return success(data)
      }

      if (base === 'attendance' && body?.entries) {
        const { data, error: err } = await supabase.from('Attendance').insert(body.entries)
        if (err) throw err
        return success(data)
      }

      if (base === 'login-requests') {
        const { data, error: err } = await supabase.from('LoginRequests').insert({
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          requestedRole: body.requestedRole,
          reason: body.reason,
          status: 'pending',
        }).select()
        if (err) throw err
        return success(data?.[0])
      }

      if (base === 'invites') {
        const { data, error: err } = await supabase.from('Invites').insert({
          email: body.email || '',
          role: body.role,
          token: body.token || crypto.randomUUID(),
          used: false,
          createdBy: '00000000-0000-0000-0000-000000000000',
        }).select()
        if (err) throw err
        return success(data?.[0])
      }

      const { data: { user } } = await supabase.auth.getUser()
      const insertData = { ...body, reportedBy: user?.id, createdBy: user?.id }

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
  'students': 'Students',
  'teachers': 'Teachers',
  'classes': 'Classes',
  'classrooms': 'Classes',
  'subjects': 'Subjects',
  'exams': 'Exams',
  'marks': 'Marks',
  'attendance': 'Attendance',
  'fees': 'FeeStructures',
  'fee-structures': 'FeeStructures',
  'payments': 'FeePayments',
  'discipline': 'DisciplinaryRecords',
  'timetable': 'Timetables',
  'communication': 'Messages',
  'announcements': 'Announcements',
  'lost-items': 'LostItems',
  'login-requests': 'LoginRequests',
  'users': 'Users',
  'invites': 'Invites',
  'reports': 'Marks',
}

async function getDashboardStats(section) {
  const [
    { count: studentCount },
    { count: teacherCount },
    { count: classCount },
    { count: userCount },
  ] = await Promise.all([
    supabase.from('Students').select('*', { count: 'exact', head: true }),
    supabase.from('Teachers').select('*', { count: 'exact', head: true }),
    supabase.from('Classes').select('*', { count: 'exact', head: true }),
    supabase.from('Users').select('*', { count: 'exact', head: true }),
  ])

  return success({
    totalStudents: studentCount || 0,
    totalTeachers: teacherCount || 0,
    totalClasses: classCount || 0,
    totalUsers: userCount || 0,
  })
}

export default api
