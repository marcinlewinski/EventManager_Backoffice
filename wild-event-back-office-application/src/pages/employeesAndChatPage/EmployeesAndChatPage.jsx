import { ResponsiveLayout } from "../layout/ResponsiveLayout"
import { EmployeesAndChatPageDesktop } from "./EmployeesAndChatPageDesktop"
import { EmployeesAndChatPagePhone } from "./EmployeesAndChatPagePhone"
export const EmployeesAndChatPage = ({isEmployee}) => {
	console.log(isEmployee)

	return (
		<ResponsiveLayout
			phoneComponent={<EmployeesAndChatPagePhone isEmployee={isEmployee} />}
			desktopComponent={<EmployeesAndChatPageDesktop isEmployee={isEmployee}/>}
		/>
	)
}
