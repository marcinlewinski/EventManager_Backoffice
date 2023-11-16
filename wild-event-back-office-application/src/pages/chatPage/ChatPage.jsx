import { ResponsiveLayout } from "../layout/ResponsiveLayout"
import { ChatPageDesktop } from "./ChatPageDesktop"
import { ChatPagePhone } from "./ChatPagePhone"

export const ChatPage = () => {
	
	return (
		<ResponsiveLayout
			phoneComponent={<ChatPagePhone />}
			desktopComponent={<ChatPageDesktop />}
		/>
	)
}
