"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { DiscordMention } from "@skyra/discord-components-react";
import { usePlausible } from "next-plausible";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function RequestBetaAccessButton() {
  const plausible = usePlausible();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="primary"
        onPress={() => {
          plausible("request-beta-access");
          onOpen();
        }}
      >
        Request Beta Access
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Apply to beta testing
              </ModalHeader>
              <ModalBody>
                <p>
                  Hi, thank you for your interest in beta testing our
                  application. We are currently looking for users to help us
                  test new features and provide feedback 🤗!
                </p>
                <h3 className="text-xl">Requirements</h3>
                <p>
                  There&apos;s no more requirements than being a user of the
                  application. We are looking for users who are willing to
                  provide feedback and report bugs. You just need to stay in the
                  support server to provide feedback and report (potentials)
                  bugs.
                </p>
                <h3 className="text-xl">How to apply ?</h3>
                <ul className="list-disc pl-5">
                  <li>Join the support server with the button below.</li>
                  <li>
                    Open a ticket in{" "}
                    <DiscordMention type="channel">support</DiscordMention>.
                  </li>
                  <li>
                    <p className="text-wrap sm:flex items-center block">
                      Click on{" "}
                      <Image
                        src="/beta_support_button.png"
                        alt="Request beta access button"
                        width={277}
                        height={64}
                      />{" "}
                      and fill the form.
                    </p>
                  </li>
                  <li>Wait for a response from the team.</li>
                  <li>You&apos;re in !</li>
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    plausible("request-beta-access-join-server");
                    onClose();
                    redirect("/support");
                  }}
                >
                  Join support server and apply !
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
