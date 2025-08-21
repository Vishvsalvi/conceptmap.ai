import { 
  Book, 
  FileText, 
  Link, 
  Newspaper, 
  Search, 
  TrendingUp, 
  Youtube 
} from "lucide-react"

export const SIDEBAR_BUTTONS = [
  { label: "What", tooltip: "Get more information about the selected topic" },
  { label: "How", tooltip: "Understand the process or method related to the topic" },
  { label: "Who", tooltip: "Identify key people or entities related to the topic", badge: true },
  { label: "Origin", tooltip: "Explore the origins or history of the topic" },
  { label: "Elaborate", tooltip: "Get a more detailed explanation of the topic" },
  { label: "Pros", tooltip: "List the advantages or benefits of the topic" },
  { label: "Cons", tooltip: "List the disadvantages or drawbacks of the topic" },
  { label: "Example", tooltip: "See an example related to the topic" },
  // { label: "Research", tooltip: "Learn and research using other sources of information", badge: true },
  { label: "YouTube", tooltip: "Find YouTube videos and tutorials on the topic", badge: true },
  { label: "Extract", tooltip: "Extract key information from the topic", badge: true },
  { label: "Concepts", tooltip: "Identify main concepts related to the topic", badge: true },
  { label: "Compare", tooltip: "Compare this topic with a related one" },
  { label: "Analogy", tooltip: "Get an analogy to help understand the topic" },
  { label: "Controversies", tooltip: "Explore controversies related to the topic", badge: true },
  { label: "Implications", tooltip: "Understand the implications of the topic", badge: true },
  { label: "Significance", tooltip: "Learn about the significance of the topic", badge: true },
  { label: "Interesting", tooltip: "Discover interesting facts about the topic" },
  { label: "Explain", tooltip: "Get a simplified explanation of the topic", badge: true },
  { label: "Question", tooltip: "Generate questions about the topic", badge: true },
  { label: "Custom", tooltip: "Ask your own custom question", badge: true },
  { label: "Logout", tooltip: "Logout from the application" }
]

export const EXTERNAL_SOURCES = [
  { name: "Wikipedia", icon: Search },
  { name: "arXiv", icon: FileText },
  { name: "PubMed", icon: FileText },
  { name: "Semantic Scholar", icon: Search },
  { name: "Links", icon: Link },
  { name: "News", icon: Newspaper },
  { name: "YouTube", icon: Youtube },
  { name: "Books", icon: Book },
  { name: "References", icon: FileText },
  { name: "Recent Developments", icon: TrendingUp },
]

export const DIALOG_OPTIONS = ["Explain", "Implications", "Significance", "Concepts"]