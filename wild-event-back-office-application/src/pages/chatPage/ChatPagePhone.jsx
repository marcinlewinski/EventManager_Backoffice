import { PhoneLayout } from "../layout/PhoneLayout"
import SimpleChat from "../../components/chat/PubNubChat/simple-chat/simple-chat"

export const ChatPagePhone = () => {
	return (
		<>
			<PhoneLayout>
				<SimpleChat />
			</PhoneLayout>
		</>
	)
}
