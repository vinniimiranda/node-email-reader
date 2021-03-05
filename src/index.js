const { MailListener } = require("mail-listener5")
const { writeFileSync } = require('fs')

require('dotenv').config()

const {  EMAIL,  PASSWORD,  HOST,} = process.env
const mailListener = new MailListener({
  username: EMAIL,
  password: PASSWORD,
  host: HOST,
  port: 993, // imap port
  tls: true,
  connTimeout: 10000, // Default by node-imap
  authTimeout: 5000, // Default by node-imap,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor
  searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
});

mailListener.start(); // start listening

mailListener.on("server:connected", function () {
  console.log("imapConnected");
});

mailListener.on("mailbox", function (mailbox) {
  console.log("Total number of mails: ", mailbox.messages.total); // this field in mailbox gives the total number of emails
});


mailListener.on("attachment", function (attachment, path, seqno) {
  console.log(attachment)
  writeFileSync(`./xml/${attachment.filename}`, attachment.content)
});

mailListener.on("mail", function (mail, seqno) {
  console.log(mail.subject)
})
