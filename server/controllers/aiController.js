const { getGeminiModel } = require('../config/gemini');
const ItemModel = require('../models/itemModel');

// AI Smart Matcher: Compare user lost/found description against database items
const matchItems = async (req, res) => {
  try {
    const { query, type } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Query description is required for AI matching.' });
    }

    // Fetch potential candidate items from opposite type if provided
    const targetType = type === 'Lost' ? 'Found' : (type === 'Found' ? 'Lost' : undefined);
    const allItems = await ItemModel.getAll({ type: targetType });

    const geminiModel = getGeminiModel('gemini-1.5-flash');

    if (geminiModel) {
      try {
        const prompt = `
You are an intelligent Lost and Found assistant for a university campus.
User input item description: "${query}"
Item report type: "${type || 'Unknown'}"

Here is the database of reported items:
${JSON.stringify(allItems.map(i => ({ id: i.id, title: i.title, description: i.description, category: i.category, location: i.location, type: i.type, date: i.date })))}

Task: Identify items from the database that could match the user's description.
Return ONLY a valid JSON object with format:
{
  "summary": "Short 1-2 sentence explanation of findings",
  "matchedIds": [array of item ids that are probable matches],
  "confidence": "High" | "Medium" | "Low"
}
        `;

        const result = await geminiModel.generateContent(prompt);
        const responseText = result.response.text();
        // Clean JSON formatting if wrapped in ```json ... ```
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiResult = JSON.parse(cleanedText);

        const matchedItems = allItems.filter(item => aiResult.matchedIds.includes(item.id));

        return res.status(200).json({
          summary: aiResult.summary,
          confidence: aiResult.confidence,
          matchedItems,
          aiPowered: true
        });
      } catch (geminiError) {
        console.warn('Gemini API call warning, falling back to smart keyword algorithm:', geminiError.message);
      }
    }

    // Fallback Smart Keyword Matcher if Gemini key is not configured or fails
    const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const scoredItems = allItems.map(item => {
      const text = `${item.title} ${item.description} ${item.category} ${item.location}`.toLowerCase();
      let score = 0;
      keywords.forEach(kw => {
        if (text.includes(kw)) score += 1;
      });
      return { item, score };
    });

    const matches = scoredItems
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(s => s.item);

    res.status(200).json({
      summary: matches.length > 0
        ? `Found ${matches.length} potential matching item(s) in campus database.`
        : `No direct matches found. Try broadening your description keywords.`,
      confidence: matches.length > 0 ? 'Medium' : 'Low',
      matchedItems: matches,
      aiPowered: false
    });
  } catch (error) {
    console.error('Error in AI match controller:', error);
    res.status(500).json({ message: 'AI matching failed.' });
  }
};

// AI Description Generator: Generate detailed post description from basic bullet points
const generateDescription = async (req, res) => {
  try {
    const { title, category, keywords } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Item title is required.' });
    }

    const geminiModel = getGeminiModel('gemini-1.5-flash');

    if (geminiModel) {
      try {
        const prompt = `
Generate a clear, polite, and detailed Lost & Found description for a university portal post.
Item Title: "${title}"
Category: "${category || 'General'}"
Key details provided by student: "${keywords || 'No additional details'}"

Keep it concise (2-4 sentences), professional, easy to read, and highlight distinguishing features.
Return ONLY the description text.
        `;

        const result = await geminiModel.generateContent(prompt);
        const generatedText = result.response.text().trim();

        return res.status(200).json({
          description: generatedText,
          aiPowered: true
        });
      } catch (geminiErr) {
        console.warn('Gemini description generation fallback:', geminiErr.message);
      }
    }

    // Smart fallback text builder
    const fallbackDesc = `Lost/Found: ${title}. Category: ${category || 'General'}. Additional details: ${keywords || 'Standard item, please contact if you have info'}. Found/lost on campus grounds.`;

    res.status(200).json({
      description: fallbackDesc,
      aiPowered: false
    });
  } catch (error) {
    console.error('Error in AI generate description:', error);
    res.status(500).json({ message: 'Failed to generate description.' });
  }
};

module.exports = {
  matchItems,
  generateDescription
};
