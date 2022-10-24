export default async (req, res) => {
    try {

        //console.log('req.body')
        //console.log(req.body)

        const { name, email, attachments } = req.body
        const plan = req.body.mapId == 'F001' ? 'Básico' : 'Entrega'
        const text = `Agradecemos por ter completado a Jornada da Política de Cancelamento do Plano ${plan}.`

        // treatments
        attachments.image = attachments.image.replace('data:image/jpeg;base64,','')
        attachments.pdf = attachments.pdf.replace('data:application/pdf;filename=generated.pdf;base64,','')

        const body = {
            text: text,
            name: name,
            email: email
        }

        console.log(body)

        const sendAttachmentEmail = () => {
            const sgMail = require('@sendgrid/mail')
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)

            //const fs = require("fs");
            //pathToAttachment = `${__dirname}/attachment.pdf`;
            //attachment = fs.readFileSync(pathToAttachment).toString("base64");

            const msg = {
                to: email,
                from: 'certificado@cancelamentoifood.com.br',
                subject: 'Certificado Ifood',
                text: 'Parabéns por ter concluído a Jornada da Política de Cancelamento! Abaixo, você encontra seu certificado.',
                attachments: [
                    {
                        content: attachments.image,
                        filename: "certificado.jpg",
                        type: "image/jpeg",
                        disposition: "attachment"
                    },
                    {
                        content: attachments.pdf,
                        filename: "certificado.pdf",
                        type: "application/pdf",
                        disposition: "attachment"
                    }
                ]
            };

            sgMail.send(msg)
                .then(() => {
                    res.status(200).json({ message: 'Email sent' })
                })
                .catch(err => {
                    console.log(err)
                    console.log(err?.response?.body?.errors)
                    res.status(400).json({ message: err.message })
                });
        }


        const sendSimpleEmail = () => {
            const sgMail = require('@sendgrid/mail')
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: 'martins@chavemestra.net', // Change to your recipient
                from: 'contato@chavemestra.net', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            }
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                    res.status(200).json({ message: 'ok' })
                })
                .catch((error) => {
                    console.error(error)
                    res.status(400).json({ message: error.message })
                })
        }

        //sendSimpleEmail()

        sendAttachmentEmail()


    }
    catch (e) {
        console.log('first CATCH e')
        console.log(e)
        //res.send(JSON.stringify(e))
        res.status(400).json({ message: e.message })
    }

}