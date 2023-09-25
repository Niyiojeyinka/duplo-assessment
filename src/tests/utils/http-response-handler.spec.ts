import { successResponse, errorResponse } from "../../utils";

describe("httpResponseHandler", () => {
  const res: any = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  beforeEach(() => {
    res.status.mockClear();
    res.json.mockClear();
  });

  it("should return a success response", () => {
    successResponse(res as any, 200, { data: "some data" }, "success message");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "success message",
      data: { data: "some data" },
    });
  });

  it("should return an error response", () => {
    const errorMessage = "some error";
    errorResponse(res as any, 400, {}, errorMessage);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({
      "success": false,
      "message": errorMessage,
      "errors": [
        {
          "type": "client",
          "value": null,
          "msg": errorMessage,
          "path": null,
          "location": null
        }
      ]
  })
  });
});
