import { DesktopLayout } from "../layout/DesktopLayout";
import SimpleChat from "../../components/companyChat/simple-chat/simple-chat";
import { useUser } from "../../services/providers/LoggedUserProvider";
import { PubNubProvider } from "pubnub-react";
import PubNub from "pubnub";

export const ChatPageDesktop = () => {
	const currentUser = useUser();
	console.log(currentUser)

	const pubnub = new PubNub({
		publishKey: process.env.REACT_APP_PUB_KEY,
		subscribeKey: process.env.REACT_APP_SUB_KEY,
		uuid: currentUser.user.id,
	});

	return (
		<PubNubProvider client={pubnub}>
			<DesktopLayout>
				<SimpleChat />
			</DesktopLayout>
		</PubNubProvider>
	);
};
