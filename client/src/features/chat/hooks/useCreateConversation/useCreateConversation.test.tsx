import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import nock from "nock";
import useCreateConversation from "./useCreateConversation";

describe("useCreateConversation", () => {
  it("should return the conversation id", async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const expectedData = "42"

    const expectation = nock(`${import.meta.env.VITE_SERVER_URL}/api`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/conversations", { targetId: 156 })
      .reply(200, { id: expectedData });

    const { result } = renderHook(() => useCreateConversation(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(expectedData);
  });
});
