import { DesktopLayout } from "../layout/DesktopLayout"
import EmployeeTable from "../../components/employeeManager/mainTable/EmployeeTable";
import SimpleChat from "../../components/chat/SimpleChat";
import { PubNubProvider } from "pubnub-react";
import PubNub from "pubnub";
import { useUser } from "../../services/providers/LoggedUserProvider"

export const EmployeesAndChatPageDesktop = ({isEmployeePage}) => {
    const { user } = useUser(); 
    console.log(isEmployeePage)

	const pubnub = new PubNub({
		publishKey: `${process.env.REACT_APP_PUBNUB_PUB_KEY}`,
		subscribeKey: `${process.env.REACT_APP_PUBNUB_SUB_KEY}`,
		userId: `${user.Id}`,
	  });

    return (
        <>
            <DesktopLayout>
                <PubNubProvider client={pubnub}> 
                {isEmployeePage ? <EmployeeTable /> : <SimpleChat />}
                </PubNubProvider>
            </DesktopLayout>
        </>
    )
}
