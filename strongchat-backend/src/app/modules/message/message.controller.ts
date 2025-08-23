import httpStatus from 'http-status';
import { messageService } from './message.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createMessage = catchAsync(async (req, res) => {
  const result = await messageService.createIntoDb(req.body, req.user.id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Message created successfully',
    data: result,
  });
});

const getsMessagesBySenderId = catchAsync(async (req, res) => {
  const result = await messageService.getsMessagesBySenderId(
    req.params.senderId,
    req.user.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Message details retrieved successfully",
    data: result,
  });
});

export const messageController = {
  createMessage,
  getsMessagesBySenderId,
};