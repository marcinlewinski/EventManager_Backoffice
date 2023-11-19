import { DesktopLayout } from "../layout/DesktopLayout"
import EmployeeTable from "../../components/employeeManager/mainTable/EmployeeTable";
import Chat from "../../components/chat/mainChat/SimpleChat";
import { PubNubProvider } from "pubnub-react";
import PubNub from "pubnub";
import { useUser } from "../../services/providers/LoggedUserProvider"

export const EmployeesAndChatPageDesktop = ({ isEmployee }) => {
    const { user } = useUser();

    const pubnub = new PubNub({
        publishKey: `${process.env.REACT_APP_PUBNUB_PUB_KEY}`,
        subscribeKey: `${process.env.REACT_APP_PUBNUB_SUB_KEY}`,
        uuid: user.id,
    });

    return (
        <>
            <DesktopLayout>
                <PubNubProvider client={pubnub}>
                    {isEmployee ? <EmployeeTable /> : <Chat />}
                </PubNubProvider>
            </DesktopLayout>
        </>
    )
}
