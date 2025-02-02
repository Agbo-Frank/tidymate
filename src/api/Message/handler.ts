import Joi from "joi";
import { Callback, ICreateMessage } from "./interface";
import Message from "../../model/message";
import { isEmpty } from "../../utility/helpers";

export async function create(payload: ICreateMessage, callback: Callback){
  const schema = Joi.object({
    from: Joi.string().required().trim(),
    order: Joi.string().required().trim(),
    message: Joi.string().required()
  })

  const { error, value } = schema.validate(payload)
  if(error){
    return callback({
      status: "failed",
      message: error.message,
      data: null
    })
  }

  try {
    const message = await Message.create({
      order: value.order,
      content: value.message,
      from: value.from
    })

    callback({
      status: "success",
      message: "Message sent successfully",
      data: message
    })

    return this.broadcast.to(value.order).emit("message:created", message);
  } catch (error) {
    return callback({
      status: "failed",
      message: error?.message || "Unable to send message, try again",
      data: null
    })
  }
}

export async function list(payload: { order: string }, callback: Callback){
  if(isEmpty(payload.order)){
    return callback({
      status: "failed",
      message: "Order id is required",
      data: null
    })
  }
  this.join(payload.order)
  const messages = await Message.find({ order: payload.order }).populate("from", "first_name last_name avatar");

  return callback({
    status: "success",
    message: "Messages retrieved successfully",
    data: messages
  })
}