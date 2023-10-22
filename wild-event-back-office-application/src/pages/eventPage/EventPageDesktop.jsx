import { DesktopLayout } from "../layout/DesktopLayout"
import Calendar from "../../components/eventManager/calendar/Calendar"

export const EventPageDesktop = () => {
	return (
		<>
			<DesktopLayout>
				<Calendar isMyCalendar={false} isAdmin={true} />
			</DesktopLayout>
		</>
	)
}
