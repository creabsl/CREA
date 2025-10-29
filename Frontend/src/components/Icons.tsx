import { 
	UilCalendarAlt,
	UilChat,
	UilFileAlt,
	UilBalanceScale,
	UilUser,
	UilBell,
	UilDocumentLayoutLeft,
	UilLink,
	UilShieldExclamation,
	UilProcess,
	UilArrowRight,
} from '@iconscout/react-unicons'

const brand = { color: 'var(--color-brand-700)', size: 20 }

export const EventIcon = () => <UilCalendarAlt {...brand} />
export const ForumIcon = () => <UilChat {...brand} />
export const CircularIcon = () => <UilDocumentLayoutLeft {...brand} />
export const CourtCaseIcon = () => <UilBalanceScale {...brand} />
export const CalendarIcon = () => <UilCalendarAlt {...brand} />
export const UserIcon = () => <UilUser {...brand} />
export const NotificationIcon = () => <UilBell {...brand} />
export const DocumentIcon = () => <UilFileAlt {...brand} />
export const LinkIcon = () => <UilLink {...brand} />
export const AdminIcon = () => <UilShieldExclamation {...brand} />
export const MembershipIcon = () => <UilUser {...brand} />
export const TransferIcon = () => <UilProcess {...brand} />
export const ArrowRightIcon = () => <UilArrowRight {...brand} />
