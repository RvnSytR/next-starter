import { z } from "zod";
import { maxFileSize, type Media, media } from "./media";
import { Capitalize } from "./utils";

export const zodFile = (mediaType: Media) =>
  z
    .instanceof(File)
    .array()
    .nonempty({ message: `At least one ${mediaType} file is required` })
    .refine(
      (files) =>
        files.every((file) => media[mediaType].type.includes(file.type)),
      { message: `Invalid ${mediaType} file type` },
    )
    .refine(
      (files) =>
        files.every((file) => file.size <= maxFileSize[mediaType].byte),
      {
        message: `${Capitalize(mediaType)} size should not exceed ${maxFileSize[mediaType].mb} MB`,
      },
    );
