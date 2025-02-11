import React from 'react';
import { verifyUser } from '@/lib/server-utils';
import { cookies } from 'next/headers';
import { CodeView } from '@fv-sdk-demos/ui-shared';
import { userApiCodeString } from '@fv-sdk-demos/ui-shared';

const codeString = `
import React from 'react';
import { verifyUser } from '@/lib/server-utils';
import { cookies } from 'next/headers';
import { CodeView } from '@fv-sdk-demos/ui-shared';

export default async function Page() {
  const cookieStore = await cookies();
  const user = await verifyUser(cookieStore);

  if (!user) {
    return (
      <>
        <h1>Auth - Server Rendering</h1>
        <div className="auto-grid gap-4">
          <div className="card">
            <div className="inner">
              <div className="row">
                <CodeView code={''} helperCode={undefined}>
                  <h3>User Server Rendered</h3>
                </CodeView>
              </div>
              <div className="row">
                <pre className="">
                  {JSON.stringify('You are not logged in', null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Auth - Server Rendering</h1>
      <div className="auto-grid gap-4">
        <div className="card">
          <div className="inner">
            <div className="row">
              <CodeView code={''} helperCode={undefined}>
                <h3>User Server Rendered</h3>
              </CodeView>
            </div>
            <div className="row">
              <pre className="">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
`;
export const dynamic = 'force-static';

export default async function Page() {
  const cookieStore = await cookies();
  const user = await verifyUser(cookieStore);

  if (!user) {
    return (
      <>
        <h1>Auth - Server Rendering</h1>
        <div className="auto-grid gap-4">
          <div className="card">
            <div className="inner">
              <div className="row">
                <CodeView code={codeString} helperCode={userApiCodeString}>
                  <h3>User Server Rendered</h3>
                </CodeView>
              </div>
              <div className="row">
                <pre className="">
                  {JSON.stringify('You are not logged in', null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Auth - Server Rendering</h1>
      <div className="auto-grid gap-4">
        <div className="card">
          <div className="inner">
            <div className="row">
              <CodeView code={codeString} helperCode={userApiCodeString}>
                <h3>User Server Rendered</h3>
              </CodeView>
            </div>
            <div className="row">
              <pre className="">{JSON.stringify(user, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
