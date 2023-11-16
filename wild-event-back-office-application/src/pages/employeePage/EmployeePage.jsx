import { ResponsiveLayout } from "../layout/ResponsiveLayout"
import { EmployeePageDesktop } from "./EmployeePageDesktop"
import { EmployeePagePhone } from "./EmployeePagePhone"
import PubNub from "pubnub"
import { PubNubProvider } from "pubnub-react"

export const EmployeePage = () => {
	const { user } = useUser(); 
	console.log(user);

	const pubnub = new PubNub({
		publishKey: `${process.env.REACT_APP_PUBNUB_PUB_KEY}`,
		subscribeKey: `${process.env.REACT_APP_PUBNUB_SUB_KEY}`,
		userId: `${user.Id}`,
	  });

	return (
		<PubNubProvider >
		<ResponsiveLayout
			phoneComponent={<EmployeePagePhone />}
			desktopComponent={<EmployeePageDesktop />}
		/>
		</PubNubProvider>
	)
}
