const { hash } = require('bcryptjs');

const { sql } = require('../db');
const { NotFoundError } = require('../util/errors');

// Returns only the public fields; the password hash never leaves this module
// except through get(), which the login route uses to compare passwords.
async function add({ email, password }) {
  const hashedPw = await hash(password, 12);
  const [user] = await sql`
    insert into react_auth.users (email, password)
    values (${email}, ${hashedPw})
    returning id, email`;
  return user;
}

async function get(email) {
  const [user] = await sql`
    select id, email, password from react_auth.users where email = ${email}`;
  if (!user) {
    throw new NotFoundError('Could not find user for email ' + email);
  }
  return user;
}

exports.add = add;
exports.get = get;
