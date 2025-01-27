const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')
const db = require('../utils/db')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex')
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

const requestPasswordReset = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    // Check if user exists
    const user = await db.get('SELECT id FROM users WHERE email = ?', [email])

    if (user) {
      const resetToken = generateResetToken()
      const resetExpiry = new Date(Date.now() + 3600000) // 1 hour from now

      await db.run(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
        [resetToken, resetExpiry.toISOString(), email],
      )

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

      await sgMail.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: 'Reset Your Password - Memory Lane',
        text: `You requested to reset your password. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
      })
    }

    // Always return success to prevent email enumeration
    res.status(200).json({
      message:
        'If an account exists with that email, you will receive password reset instructions.',
    })
  } catch (error) {
    console.error('Error handling password reset:', error)
    res.status(500).json({ error: 'Failed to process password reset request' })
  }
}
module.exports = {
  sendEmail,
  requestPasswordReset,
}
