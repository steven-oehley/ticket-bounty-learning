export const initialTickets = [
  {
    id: '1',
    title: 'Fix login bug',
    content:
      'Users are unable to log in with correct credentials. Investigate the authentication flow and identify any issues with the login API or frontend validation that may be causing this problem. Ensure to check for any recent changes that might have affected the login functionality.',
    status: 'OPEN' as const,
  },
  {
    id: '2',
    title: 'Add dark mode',
    content:
      'Implement dark mode for better user experience at night. This should include a toggle switch in the settings. Make sure to update all relevant components to support dark mode styling.',
    status: 'IN_PROGRESS' as const,
  },
  {
    id: '3',
    title: 'Update user profile page',
    content:
      'Redesign the user profile page to include more details. Consider adding sections for recent activity, friends list, and user statistics. Ensure the design is responsive and works well on mobile devices.',
    status: 'DONE' as const,
  },
];
