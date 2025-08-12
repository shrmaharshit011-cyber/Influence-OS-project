// backend/quotes.jsw
import wixCrmBackend from 'wix-crm-backend';
import wixData from 'wix-data';

/**
 * createOrGetContactByEmail
 * Creates a contact if it doesn't exist, or returns existing contact id.
 * payload: { name, email }
 */
export async function createOrGetContactByEmail(payload) {
  if(!payload || !payload.email) throw new Error('Email required');
  // search for contact by email
  const contacts = await wixCrmBackend.searchContacts({ field: "emails", value: payload.email });
  if (contacts && contacts.items && contacts.items.length > 0) {
    return contacts.items[0]._id;
  }

  // create contact
  const contactObj = {
    firstName: payload.name || '',
    emails: [{ email: payload.email }]
  };
  const created = await wixCrmBackend.createContact(contactObj);
  return created._id;
}

/**
 * saveQuote
 * Save a quote record to the Quotes collection and returns the saved item.
 * quote: { name, email, agents, seats, term, monthlyEffective, oneTimeFees, notes }
 */
export async function saveQuote(quote) {
  if(!quote || !quote.email) throw new Error('Quote must include email');

  // ensure contact exists and get contact id
  const contactId = await createOrGetContactByEmail({ name: quote.name, email: quote.email });

  const toInsert = {
    title: `Quote for ${quote.email} — ${new Date().toISOString().slice(0,10)}`,
    contactId,
    email: quote.email,
    seats: Number(quote.seats) || 0,
    term: quote.term || 'monthly',
    agents: Array.isArray(quote.agents) ? quote.agents.join(', ') : (quote.agents || ''),
    monthlyEffective: Number(quote.monthlyEffective) || 0,
    oneTimeFees: Number(quote.oneTimeFees) || 0,
    createdAt: new Date(),
    notes: quote.notes || ''
  };

  const saved = await wixData.insert('Quotes', toInsert);
  return saved;
}
