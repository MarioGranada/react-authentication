const { sql } = require('../db');
const { NotFoundError } = require('../util/errors');

async function getAll() {
  return sql`
    select id, title, description, date, image
    from react_auth.events
    order by created_at desc`;
}

async function get(id) {
  const [event] = await sql`
    select id, title, description, date, image
    from react_auth.events
    where id = ${id}`;
  if (!event) {
    throw new NotFoundError('Could not find event for id ' + id);
  }
  return event;
}

async function add({ title, description, date, image }) {
  const [event] = await sql`
    insert into react_auth.events (title, description, date, image)
    values (${title}, ${description}, ${date}, ${image})
    returning id, title, description, date, image`;
  return event;
}

async function replace(id, { title, description, date, image }) {
  const [event] = await sql`
    update react_auth.events
    set title = ${title}, description = ${description}, date = ${date}, image = ${image}
    where id = ${id}
    returning id, title, description, date, image`;
  if (!event) {
    throw new NotFoundError('Could not find event for id ' + id);
  }
  return event;
}

async function remove(id) {
  await sql`delete from react_auth.events where id = ${id}`;
}

exports.getAll = getAll;
exports.get = get;
exports.add = add;
exports.replace = replace;
exports.remove = remove;
