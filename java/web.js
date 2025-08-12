// page code for the Pricing page (e.g., Pricing Page -> Page Code)
import { saveQuote } from 'backend/quotes';
import wixWindow from 'wix-window';

// Assumes you built a UI with inputs having IDs matching these. Adjust IDs if different.
$w.onReady(function () {
  // Hook up your calculate button or event listeners as you already did in client JS.
  $w('#btnSaveQuote').onClick(async () => {
    try {
      $w('#btnSaveQuote').disable();
      const name = $w('#nameInput').value || '';
      const email = $w('#emailInput').value || '';
      if(!email) {
        wixWindow.openLightbox('ErrorLightbox', { message: 'Please enter email' });
        $w('#btnSaveQuote').enable();
        return;
      }

      // Gather selected agents checkboxes (example: a repeater or multi-checkbox)
      // For demonstration, assume you have a multi-select input or checkboxes with dataset
      const selectedAgents = getSelectedAgentsFromUI(); // implement this helper to read your UI

      // Gather pricing values displayed on page
      const monthlyEffective = Number($w('#priceText').text.replace(/[^\d\.]/g,'')) || 0;
      const seats = Number($w('#seatsInput').value) || 0;
      const term = $w('#termSelect').value || 'monthly';
      const oneTimeFees = Number($w('#onboardingInput').value) || 0;

      const quotePayload = {
        name,
        email,
        agents: selectedAgents,
        seats,
        term,
        monthlyEffective,
        oneTimeFees,
        notes: `Generated from pricing calculator`
      };

      const saved = await saveQuote(quotePayload);
      // saved contains the saved Quotes collection item (including _id)
      wixWindow.openLightbox('QuoteSavedLightbox', { quoteId: saved._id, monthly: monthlyEffective });
    } catch (err) {
      console.error('save quote error', err);
      wixWindow.openLightbox('ErrorLightbox', { message: err.message || 'Unable to save quote' });
    } finally {
      $w('#btnSaveQuote').enable();
    }
  });
});

/**
 * Example helper to collect agent selections from UI.
 * Replace this with your real implementation that reads checkboxes or repeater selections.
 */
function getSelectedAgentsFromUI() {
  // If you built checkboxes with IDs agentCheckbox1..N, check them here and return array.
  // PROTOTYPE: return static example
  return ['Social Media','Analytics & Insights'];
}
