import auth from './auth'
import billing from './billing'
import common from './common'
import dashboard from './dashboard'
import help from './help'
import jobs from './jobs'
import legal from './legal'
import nav from './nav'
import settings from './settings'

// Each domain file is typed against its English counterpart, so this
// aggregate matches the canonical shape by construction.
const fr = { common, nav, auth, dashboard, jobs, billing, settings, help, legal }
export default fr
