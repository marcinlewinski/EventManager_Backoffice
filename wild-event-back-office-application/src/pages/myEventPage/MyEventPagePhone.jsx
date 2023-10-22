import Calendar from "../../components/eventManager/calendar/Calendar"
import { PhoneLayout } from "../layout/PhoneLayout"

export const MyEventPagePhone = () => {
	return (
		<>
			<PhoneLayout>
				<Calendar isMyCalendar={true} isMobileView={true} />
			</PhoneLayout>
		</>
	)
}
