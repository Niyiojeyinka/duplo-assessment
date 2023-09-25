import { successResponse, errorResponse } from "../../utils";

describe("httpResponseHandler", () => {
  const res: any = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };

  beforeEach(() => {
    res.status.mockClear();
    res.send.mockClear();
  });

  it("should return a success response", () => {
    successResponse(res as any, 200, { data: "some data" }, "success message");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      message: "success message",
      data: { data: "some data" },
    });
  });

  it("should return an error response", () => {
    const errorMessage = "some error";
    errorResponse(res as any, 400, {}, errorMessage);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send).toHaveBeenCalledWith({
      "success": false,
      "message": errorMessage,
      "errors": [
        {
          message: errorMessage
        }
      ]
  })
  });
});
