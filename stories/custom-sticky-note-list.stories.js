import "../src/custom-sticky-note-list.js";

export default {
  parameters: {
    layout: "centered",
  },
};

export const CustomStickyNoteList = () => 
`
<custom-sticky-note-list note-width=200px note-font="Times New Roman" note-font-size=18px notes='[
    {"title": "Shopping", "body": "Buy milk and eggs", "due_date": "2024-06-01", "done": false, "color": "#ffcc80", "alignment": "left"},
    {"title": "Meeting", "body": "Project meeting at 10 AM", "due_date": "2024-05-29", "done": false, "color": "#ff0000", "alignment": "center"},
    {"title": "Exercise", "body": "Morning yoga session", "due_date": "2024-05-28", "done": true, "color": "#80deea", "alignment": "right"}
  ]'> list
	</custom-sticky-note-list>
`;
