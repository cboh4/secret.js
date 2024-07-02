import { toBase64, toBech32 } from "@cosmjs/encoding";
import { MsgParams } from ".";
// import { addressToBytes } from "..";
import { AminoMsg, Msg, ProtoMsg } from "./types";

export interface RaAuthenticateParams extends MsgParams {
  sender: Uint8Array;
  certificate: Uint8Array;
  sender_address: string;
}

/** RaAuthenticate defines a message to register an new node. */
export class RaAuthenticate implements Msg {
  constructor(public params: RaAuthenticateParams) {}

  async toProto(): Promise<ProtoMsg> {
    const msgContent = {
      sender: toBech32('secret', this.params.sender),
      sender_addr: this.params.sender,
      certificate: this.params.certificate,
    };

    return {
      type_url: "/secret.registration.v1beta1.RaAuthenticate",
      value: msgContent,
      encode: async () =>
        (
          await import("../protobuf/secret/registration/v1beta1/msg")
        ).RaAuthenticate.encode(msgContent).finish(),
    };
  }

  async toAmino(): Promise<AminoMsg> {
    return {
      type: "reg/authenticate",
      value: {
        sender: this.params.sender,
        ra_cert: toBase64(this.params.certificate),
      },
    };
  }
}
