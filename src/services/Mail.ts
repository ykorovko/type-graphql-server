import {
  createTestAccount,
  createTransport,
  TestAccount,
  Transporter,
  SendMailOptions,
  getTestMessageUrl
} from "nodemailer";
import SMTPConnection from "nodemailer/lib/smtp-connection";

interface MailService {
  sendMail: (params: SendMailOptions) => void;
}

class Mail implements MailService {
  private _transporter: Transporter;

  static defaultOptions: SendMailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    subject: "Hello ✔" // Subject line
  };

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount: TestAccount = await createTestAccount();

    const options: SMTPConnection.Options = {
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    };

    // Create reusable transporter object using the default SMTP transport
    this._transporter = createTransport(options);
  }

  sendMail(params: SendMailOptions): void {
    const options: SendMailOptions = {
      ...Mail.defaultOptions,
      ...params
    };

    this._transporter.sendMail(options, (error, info) => {
      if (error) return console.log(`error: ${error}`);

      console.log(`Message Sent ${info.response}`);

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", getTestMessageUrl(info));
    });
  }
}

export default new Mail();
