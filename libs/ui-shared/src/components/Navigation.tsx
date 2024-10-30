'use client';

import { useAuth } from '@futureverse/auth-react';
import { useAuthUi } from '@futureverse/auth-ui';
import React, { CSSProperties, Dispatch, SetStateAction } from 'react';

export interface MenuProps {
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileOpen?: boolean;
  openByDefault?: boolean;
}

export function Navigation({
  Menu,
  isMobileOpen,
  setIsMobileOpen,
}: {
  Menu: React.FC<MenuProps>;
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { userSession } = useAuth();

  return (
    <div role="navigation">
      <ul className="desktop-nav ">
        {!userSession && <LogIn />}
        {userSession && (
          <Menu setIsOpen={setIsMobileOpen} isMobileOpen={isMobileOpen} />
        )}
      </ul>
      <ul className="mobile-nav">
        {!userSession && <LogIn />}
        {userSession && (
          <li className="mobile-wrap">
            <div
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="btn green"
            >
              Menu
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

export const LogIn = ({ styles }: { styles?: CSSProperties }) => {
  const { openLogin } = useAuthUi();

  return (
    <button onClick={() => openLogin()} className="green" style={styles}>
      Log In
    </button>
  );
};

// export const LogOut = () => {
//   const { signOut, userSession } = useAuth();
//   const { disconnect, isConnected } = useConnector();
//   return (
//     <DropDownMenu
//       title={shortAddress(userSession?.futurepass ?? '', 6, 4)}
//       buttonClasses="green"
//       classes="wallet-dropdown"
//     >
//       <div className="wallet-dropdown-inner">
//         <button
//           onClick={() => {
//             isConnected && disconnect();
//             signOut({ flow: 'redirect' });
//           }}
//           className="green"
//         >
//           Log Out
//         </button>
//       </div>
//     </DropDownMenu>
//   );
// };

// export const ResourceMenu = () => {
//   return (
//     <DropDownMenu title="Resources">
//       <ul className="dropdown-content">
//         <li>
//           <a
//             href="https://faucet.rootnet.cloud"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Porcini Faucet
//           </a>
//         </li>
//         <li>
//           <a
//             href="https://github.com/futureversecom/trn-examples/tree/main/examples/substrate"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             NodeJS Native
//             <br />
//             Examples
//           </a>
//         </li>
//         <li>
//           <a
//             href="https://github.com/futureversecom/trn-examples/tree/main/examples/evm"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             NodeJS EVM
//             <br />
//             Examples
//           </a>
//         </li>
//       </ul>
//     </DropDownMenu>
//   );
// };

// export const ResourceMenuMobile = () => {
//   return (
//     <ul>
//       <li>
//         <div className="sectionTitle">Resources</div>
//         <ul className="dropdown-content">
//           <li>
//             <a
//               href="https://faucet.rootnet.cloud"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Porcini Faucet
//             </a>
//           </li>
//           <li>
//             <a
//               href="https://github.com/futureversecom/trn-examples/tree/main/examples/substrate"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               NodeJS Native
//               <br />
//               Examples
//             </a>
//           </li>
//           <li>
//             <a
//               href="https://github.com/futureversecom/trn-examples/tree/main/examples/evm"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               NodeJS EVM
//               <br />
//               Examples
//             </a>
//           </li>
//         </ul>
//       </li>
//     </ul>
//   );
// };
