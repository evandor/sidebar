import { Injectable } from "@angular/core";
//import { CognitoUtil, UserLoginService, Callback } from "./cognito.service";
//import { Stuff } from "../secure/useractivity.component";
import { Sidebar } from "../domain/sidebar";

declare var AWS: any;

@Injectable()
export class DynamoDBService {

    public static DDB: any;

    static getSidebars(id: string, mapArray: Array<Sidebar>) {
        var params = {
            TableName: 'sidebar',
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": id
            }
        };
        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.query(params, onQuery);

        function onQuery(err, data) {
            if (err) {
                console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                data.Items.forEach(function (logitem) {
                    mapArray.push({ sidebarName: logitem.sidebarName, uuid: logitem.uuid, userId: logitem.userId });
                });
            }
        }
    }

    static getCategories(sidebarUUID: string, mapArray: Array<any>) {
        var params = {
            TableName: 'bookmark',
            KeyConditionExpression: "sidebarUUID = :sidebarUUID",
            ExpressionAttributeValues: {
                ":sidebarUUID": sidebarUUID
            }
        };
        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.query(params, onQuery);

        function onQuery(err, data) {
            if (err) {
                console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                data.Items.forEach(function (logitem) {
                    mapArray.push({ bucketname: logitem.bucketname, uuid: logitem.uuid, bookmarks: logitem.bookmarks });
                });
            }
        }
    }


    static getBookmarks(id: string, mapArray: Array<any>) {
        var params = {
            TableName: 'bookmark',
            KeyConditionExpression: "sidebarUUID = :sidebarUUID",
            ExpressionAttributeValues: {
                ":sidebarUUID": id
            }
        };
        //console.log(params);
        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.query(params, onQuery);

        function onQuery(err, data) {
            if (err) {
                console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                data.Items.forEach(function (logitem) {
                    //console.log(logitem);
                    mapArray.push({ bucketname: logitem.bucketname, uuid: logitem.uuid, bookmarks: logitem.bookmarks });
                });
            }
        }
    }

    static writeLogEntry(type: string) {
        let date = new Date().toString();
        //console.log("Writing log entry..type:" + type + " id: " + AWS.config.credentials.params.IdentityId + " date: " + date);
        DynamoDBService.write(AWS.config.credentials.params.IdentityId, date, type);
    }

    static write(data: string, date: string, type: string): void {
        DynamoDBService.DDB = new AWS.DynamoDB({
            params: { TableName: 'LoginTrail' }
        });

        // Write the item to the table
        var itemParams =
            {
                Item: {
                    userId: { S: data },
                    activityDate: { S: date },
                    type: { S: type }
                }
            };
        DynamoDBService.DDB.putItem(itemParams, function (result) {
        });
    }

}