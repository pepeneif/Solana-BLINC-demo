import React, { useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useConnectionConfig, MAINNET_URL } from '../utils/connection';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { clusterApiUrl } from '@solana/web3.js';
import { useWalletSelector } from '../utils/wallet';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import ExitToApp from '@material-ui/icons/ExitToApp';
import AccountIcon from '@material-ui/icons/AccountCircle';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import SolanaIcon from './SolanaIcon';
import CodeIcon from '@material-ui/icons/Code';
import Tooltip from '@material-ui/core/Tooltip';
import AddAccountDialog from './AddAccountDialog';
import DeleteAccountDialog from "./DeleteAccountDialog";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  menuItemIcon: {
    minWidth: 32,
  },
}));

export default function NavigationFrame({ children }) {
  const classes = useStyles();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title} component="h1">
            Solana BLINC demo
          </Typography>
          <WalletSelector />
          <NetworkSelector />
        </Toolbar>
      </AppBar>
      <main className={classes.content}>{children}</main>
      <Footer />
    </>
  );
}

function NetworkSelector() {
  const { endpoint, setEndpoint } = useConnectionConfig();
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const networks = [
    MAINNET_URL,
    clusterApiUrl('devnet'),
    clusterApiUrl('testnet'),
    'http://localhost:8899',
  ];

  const networkLabels = {
    [MAINNET_URL]: 'Mainnet',
    [clusterApiUrl('devnet')]: 'Devnet',
    [clusterApiUrl('testnet')]: 'Testnet',
  };

  return (
    <>
      <Hidden xsDown>
        <Button
          color="inherit"
          onClick={(e) => setAnchorEl(e.target)}
          className={classes.button}
        >
          {networkLabels[endpoint] ?? 'Network'}
        </Button>
      </Hidden>
      <Hidden smUp>
        <Tooltip title="Select Network" arrow>
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.target)}>
            <SolanaIcon />
          </IconButton>
        </Tooltip>
      </Hidden>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
      >
        {networks.map((network) => (
          <MenuItem
            key={network}
            onClick={() => {
              setAnchorEl(null);
              setEndpoint(network);
            }}
            selected={network === endpoint}
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {network === endpoint ? <CheckIcon fontSize="small" /> : null}
            </ListItemIcon>
            {network === 'https://solana-api.projectserum.com' ? 'Solana Mainnet-Beta' : network }
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function WalletSelector() {
  const { accounts, setWalletSelector, addAccount } = useWalletSelector();
  const [anchorEl, setAnchorEl] = useState(null);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [isDeleteAccountEnabled, setIsDeleteAccountEnabled] = useState(false);
  const classes = useStyles();

  if (accounts.length === 0) {
    return null;
  }

  return (
    <>
      <AddAccountDialog
        open={addAccountOpen}
        onClose={() => setAddAccountOpen(false)}
        onAdd={({ name, importedAccount }) => {
          addAccount({ name, importedAccount });
          setWalletSelector({
            walletIndex: importedAccount ? undefined : accounts.length,
            importedPubkey: importedAccount
              ? importedAccount.publicKey.toString()
              : undefined,
          });
          setAddAccountOpen(false);
        }}
      />
      <DeleteAccountDialog
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        isDeleteAccountEnabled={isDeleteAccountEnabled}
      />
      <Hidden xsDown>
        <Button
          color="inherit"
          onClick={(e) => setAnchorEl(e.target)}
          className={classes.button}
        >
	 Accounts
        </Button>
      </Hidden>
      <Hidden smUp>
        <Tooltip title="Select Account" arrow>
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.target)}>
            <AccountIcon />
          </IconButton>
        </Tooltip>
      </Hidden>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
      >
        {accounts.map(({ isSelected, selector, address, name, label }) => (
          <MenuItem
            key={address.toBase58()}
            onClick={() => {
              setAnchorEl(null);
              setWalletSelector(selector);
            }}
            selected={isSelected}
            component="div"
          >
            <ListItemIcon className={classes.menuItemIcon}>
              {isSelected ? <CheckIcon fontSize="small" /> : null}
            </ListItemIcon>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography>{name}</Typography>
              <Typography color="textSecondary">
                {address.toBase58()}
              </Typography>
            </div>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setAddAccountOpen(true);
          }}
        >
          <ListItemIcon className={classes.menuItemIcon}>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          Add Account
        </MenuItem>
        <MenuItem onClick={() => {
          setAnchorEl(null);
          setIsDeleteAccountEnabled(false);
          setDeleteAccountOpen(true)
          setTimeout(() => {setIsDeleteAccountEnabled(true)}, 3000)
        }}>
          <ListItemIcon className={classes.menuItemIcon}>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Delete Account
        </MenuItem>
      </Menu>
    </>
  );
}

const useFooterStyles = makeStyles((theme) => ({
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(2),
  },
}));

function Footer() {
  const classes = useFooterStyles();
  return (
    <footer className={classes.footer}>
      <Button
        variant="outlined"
        color="primary"
        component="a"
        target="_blank"
        rel="noopener"
        href="https://github.com/pepeneif/Solana-BLINC-demo"
        startIcon={<CodeIcon />}
      >
        View Source
      </Button>
    </footer>
  );
}
