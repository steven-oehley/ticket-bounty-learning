import { getAuthOrRedirect } from '@/features/auth/queries/get-auth-or-redirect';

const TicketAuthLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // ideally this should be done at a page level
  // having this year - because of use of cookies - all children are dynamic and not statically rendered
  //   could use middleware to go around this
  // what is most important is that data layer protected - read and write actions from the server
  const _auth = await getAuthOrRedirect();
  return <>{children}</>;
};

export default TicketAuthLayout;
