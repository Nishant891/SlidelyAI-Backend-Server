import AWS from "aws-sdk";
import { Request, Response, NextFunction } from "express";

const route53 = new AWS.Route53();

export const getRecords = async (req: Request, res: Response) => {
  const { hostedZoneId, domainName } = req.query;

  if (!hostedZoneId || !domainName) {
    return res.status(400).json({
      success: false,
      message: "hostedZoneId and domainName are required.",
    });
  }

  const params = {
    HostedZoneId: hostedZoneId as string,
  };

  try {
    const data = await route53.listResourceRecordSets(params).promise();
    const records = data.ResourceRecordSets.filter((record) =>
      record.Name.includes(domainName as string)
    );
    res.status(200).json({
      success: true,
      records: records,
      message: "Records fetched successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Unable to fetch records",
    });
  }
};
