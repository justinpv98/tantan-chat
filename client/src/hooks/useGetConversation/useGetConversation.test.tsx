import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import nock from "nock";
import useGetConversation from "./useGetConversation";

describe("useGetConversation", () => {
  it("should return fetched data", async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const conversationId = "2";
    const expectedData = {  id: "1",
      name: null,
      type: "dm",
      participants: [{}, {}],
      messages: [{}, {}]}

    const expectation = nock(`${import.meta.env.VITE_SERVER_URL}/api`)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get(`/conversations/${conversationId}`)
      .reply(200, expectedData);

    const { result } = renderHook(() => useGetConversation(conversationId, true), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toStrictEqual(expectedData);
  });
});
