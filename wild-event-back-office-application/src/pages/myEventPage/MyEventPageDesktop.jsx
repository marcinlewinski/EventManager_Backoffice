import Calendar from "../../components/eventManager/calendar/Calendar"
import { DesktopLayout } from "../layout/DesktopLayout"

export const MyEventPageDesktop = () => {
	return (
		<>
			<DesktopLayout>
				<Calendar isMyCalendar={true} />
			</DesktopLayout>
		</>
	)
}
