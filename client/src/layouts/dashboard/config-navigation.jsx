import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics')
  },
  {
    title: 'Appointments',
    path: '/user',
    icon: icon('ic_user')
  },
  {
    title: 'Packages',
    path: '/packages',
    icon: icon('ic_cart')
  },
  {
    title: 'My package',
    path: '/viewPackage',
    icon: icon('ic_cart')
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog')
  },
  {
    title: 'contract',
    path: '/contract',
    icon: icon('ic_contract')
  },
  {
    title: 'add Slots Or Appointment',
    path: '/addSlotsOrAppointment',
    icon: icon('ic_add')
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock')
  },
  {
    title: 'Register',
    path: '/register',
    icon: icon('ic_lock')
  },
  {
    title: 'Doctors',
    path: '/doctors',
    icon: icon('ic_user')
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: icon('ic_user')
  },
  {
    title: 'Upload Documents',
    path: '/upload-document',
    icon: icon('ic_disabled')
  },
  {
    title: 'Medical History',
    path: '/medical-history',
    icon: icon('ic_disabled')
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: icon('ic_user')
  },
  {
    title: 'Upload Documents',
    path: '/upload-document',
    icon: icon('ic_disabled')
  },
  {
    title: 'Medical History',
    path: '/medical-history',
    icon: icon('ic_disabled')
  },
  {
    title: 'My Health Records',
    path: '/health-record',
    icon: icon('ic_analytics')
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled')
  },
  {
    title: 'Add Family Member',
    path: '/addFamily',
    icon: icon('ic_user')
  },
  {
    title: 'Forgot Password',
    path: '/forgot-password',
    icon: icon('ic_disabled')
  },
  {
    title: 'View Requests',
    path: '/requests-list',
    icon: icon('ic_disabled')
  }
];

export default navConfig;
