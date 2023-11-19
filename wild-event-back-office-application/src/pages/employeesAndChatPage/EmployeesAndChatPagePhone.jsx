import { PhoneLayout } from "../layout/PhoneLayout"
import EmployeeTable from "../../components/employeeManager/mainTable/EmployeeTable";

export const EmployeesAndChatPagePhone = () => {
	return (
		<>
			<PhoneLayout>
				<EmployeeTable />
			</PhoneLayout>
		</>
	)
}
