const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendPasswordResetEmail = async (email, resetUrl) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Reset Your Password - Memory Lane',
    text: `You requested to reset your password. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
  }

  await sgMail.send(msg)
}

const sendEmail = async (req, res) => {
  const { email, title, description, url } = req.body

  if (!email || !title || !description || !url) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: `Check out this memory: ${title}`,
    text: `${description}\n\nView it here: ${url}`,
  }

  try {
    await sgMail.send(msg)
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
}

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
}
