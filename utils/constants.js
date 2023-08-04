const sources = [
  {
    id: 'a8mgLuqUae4',
    title: 'Friends',
    group: 'Series'
  },
  {
    id: 'xO28d8CExO0',
    title: 'BBH',
    group: 'Series'
  },
  {
    id: 'M8KmqaJvgpE',
    title: 'The Office',
    group: 'Series'
  },
  {
    id: 'E6l0ObY2XVM',
    title: 'PrH',
    group: 'Interview'
  }

];

const errors = [
  'Invalid email',
  'Email is required',
  'Password is required',
  'User name must be',
  'User name is required',
  'Password is required',
  'Password must be'
];

const userNameLengthMin = 2;
const userNameLengthMax = 30;
const passwordLengthMin = 7;

const resetPassText = (link) => {
  return (
  `Hello,
    You are receiving this email because you requested a password reset for your account.
    If you didn't request a password reset, please ignore this email.

    If you wish to reset your password, please copy and paste the following link into your browser:
    ${link}

    The link is valid for 1 hour.

    Best regards,
    Your Word Learner App`
  )
}

module.exports = {
  sources, errors, userNameLengthMin, userNameLengthMax, passwordLengthMin, resetPassText
}
