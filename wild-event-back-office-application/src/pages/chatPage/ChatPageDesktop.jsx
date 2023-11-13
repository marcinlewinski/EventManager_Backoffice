import { DesktopLayout } from "../layout/DesktopLayout";
import SimpleChat from "../../components/chat/SimpleChat";
import { useUser } from "../../services/providers/LoggedUserProvider";
import { PubNubProvider } from "pubnub-react";
import PubNub from "pubnub";

export const ChatPageDesktop = () => {
    const currentUser = useUser();
    console.log(currentUser.user.id)

    const pubnub = new PubNub({
        publishKey: 'pub-c-cf038bb4-7b99-49cc-a115-f646aaf93f99',
        subscribeKey: 'sub-c-74852b0d-5941-4aeb-bef3-62909b8a9576',
        userId: currentUser.user.id,
    });

    pubnub.addListener({
        message: function (m) {
          // handle messages
        },
        presence: function (p) {
          // handle presence  
        },
        signal: function (s) {
          // handle signals
        },
        objects: (objectEvent) => {
          // handle objects
        },
        messageAction: function (ma) {
          // handle message actions
        },
        file: function (event) {
          // handle files  
        },
        status: function (s) {
        // handle status  
        },
      });

      var publishPayload = {
        channel : "hello_world",
        message: {
            title: "greeting",
            description: "This is my first message!"
        }
    }
    
    // pubnub.publish(publishPayload, function(status, response) {
    //     console.log(status, response);
    // })
    
    // pubnub.subscribe({
    //     channels: ["hello_world"]
    // });

  
    
    return (
        <PubNubProvider client={pubnub}>
            <DesktopLayout>
                <SimpleChat />
            </DesktopLayout>
        </PubNubProvider>
    );
};