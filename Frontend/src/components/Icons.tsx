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
	UilAngleDown,
	UilBuilding,
	UilUsersAlt,
	UilDownloadAlt,
	UilEdit,
	UilTrashAlt,
	UilPlus,
} from '@iconscout/react-unicons'
import type { UniconProps } from '@iconscout/react-unicons'

type IconProps = Omit<UniconProps, 'color' | 'size'> & {
	color?: string
	size?: number | string
}

const withDefaults = (props: IconProps) => ({ size: props.size ?? 20, className: `icon ${props.className ?? ''}`.trim(), ...(props.color ? { color: props.color } : {}) })

export const EventIcon = (p: IconProps = {}) => <UilCalendarAlt {...withDefaults(p)} aria-hidden />
export const ForumIcon = (p: IconProps = {}) => <UilChat {...withDefaults(p)} aria-hidden />
export const CircularIcon = (p: IconProps = {}) => <UilDocumentLayoutLeft {...withDefaults(p)} aria-hidden />
export const CourtCaseIcon = (p: IconProps = {}) => <UilBalanceScale {...withDefaults(p)} aria-hidden />
export const CalendarIcon = (p: IconProps = {}) => <UilCalendarAlt {...withDefaults(p)} aria-hidden />
export const UserIcon = (p: IconProps = {}) => <UilUser {...withDefaults(p)} aria-hidden />
export const NotificationIcon = (p: IconProps = {}) => <UilBell {...withDefaults(p)} aria-hidden />
export const DocumentIcon = (p: IconProps = {}) => <UilFileAlt {...withDefaults(p)} aria-hidden />
export const LinkIcon = (p: IconProps = {}) => <UilLink {...withDefaults(p)} aria-hidden />
export const AdminIcon = (p: IconProps = {}) => <UilShieldExclamation {...withDefaults(p)} aria-hidden />
export const MembershipIcon = (p: IconProps = {}) => <UilUser {...withDefaults(p)} aria-hidden />
export const TransferIcon = (p: IconProps = {}) => <UilProcess {...withDefaults(p)} aria-hidden />
export const ArrowRightIcon = (p: IconProps = {}) => <UilArrowRight {...withDefaults(p)} aria-hidden />
export const ArrowDownIcon = (p: IconProps = {}) => <UilAngleDown {...withDefaults(p)} aria-hidden />
export const BuildingIcon = (p: IconProps = {}) => <UilBuilding {...withDefaults(p)} aria-hidden />
export const UsersIcon = (p: IconProps = {}) => <UilUsersAlt {...withDefaults(p)} aria-hidden />
export const DownloadIcon = (p: IconProps = {}) => <UilDownloadAlt {...withDefaults(p)} aria-hidden />
export const EditIcon = (p: IconProps = {}) => <UilEdit {...withDefaults(p)} aria-hidden />
export const TrashIcon = (p: IconProps = {}) => <UilTrashAlt {...withDefaults(p)} aria-hidden />
export const PlusIcon = (p: IconProps = {}) => <UilPlus {...withDefaults(p)} aria-hidden />
