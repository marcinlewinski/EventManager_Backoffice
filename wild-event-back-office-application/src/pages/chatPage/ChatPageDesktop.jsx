import { DesktopLayout } from "../layout/DesktopLayout"
import SimpleChat from "../../components/chat/PubNubChat/simple-chat/simple-chat";
import { useUser } from "./services/providers/LoggedUserProvider";
import { PubNubProvider } from "pubnub-react";
import PubNub from "pubnub";

const currentUser = useUser();

const pubnub = new PubNub({
	publishKey: process.env.REACT_APP_PUB_KEY,
	subscribeKey: process.env.REACT_APP_SUB_KEY,
	uuid: currentUser.id,
});

export const ChatPageDesktop = () => {
	return (
		<PubNubProvider client={pubnub}>
			<DesktopLayout>
				<SimpleChat />
			</DesktopLayout>
		</PubNubProvider>
	)
}
