"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  PaymentStatusEvent,
  PaymentStatusEventStatus,
} from "@/lib/types";

type PaymentSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface UsePaymentSocketOptions {
  readonly reference: string | null;
  readonly onStatus: (event: PaymentStatusEvent) => void;
}

export function usePaymentSocket({ reference, onStatus }: UsePaymentSocketOptions): void {
  const socketRef = useRef<PaymentSocket | null>(null);
  const onStatusRef = useRef(onStatus);
  onStatusRef.current = onStatus;

  useEffect((): (() => void) => {
    if (reference === null) return (): void => {};

    const socket: PaymentSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", (): void => {
      socket.emit("subscribe", { reference });
    });

    socket.on("payment:status", (event: PaymentStatusEvent): void => {
      const terminal: ReadonlyArray<PaymentStatusEventStatus> = ["success", "failed"];
      if (terminal.includes(event.status)) {
        onStatusRef.current(event);
      }
    });

    return (): void => {
      socket.emit("unsubscribe", { reference });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [reference]);
}
