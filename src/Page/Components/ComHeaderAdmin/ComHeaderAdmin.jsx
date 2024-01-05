import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  ShoppingBagIcon,
  PresentationChartBarIcon,

  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  XMarkIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, } from '@heroicons/react/20/solid'
import { ComLink } from '../ComLink/ComLink'
import { Link, useNavigate } from 'react-router-dom'
import { getData } from '../../../api/api'
import { Affix } from 'antd'
import { useCookies } from 'react-cookie'
import images from '../../../img'
import { routs } from '../../../constants/ROUT'
import { textApp } from '../../../TextContent/textApp'
import { AccordionBody, AccordionHeader, ListItem, ListItemPrefix, Typography } from '@material-tailwind/react'
import React from "react";
import {
  Card,
  List,
  ListItemSuffix,
  Chip,
  Accordion,
} from "@material-tailwind/react";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useStorage } from '../../../hooks/useLocalStorage'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ComHeaderAdmin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useStorage('user', {})
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
  const navigate = useNavigate();
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  useEffect(() => {
    if (!(user?._doc?.role === 'admin')) {

      navigate('/login')
    }
  }, []);
  return (
    <Affix offsetTop={0}>
      <header className="bg-white border-b border-gray-200  ">
        <nav className="mx-auto flex  items-center justify-between px-6  bg-slate-300" aria-label="Global">
          <div className="flex ">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-1 justify-center">
            <img className="h-16 w-auto" src={images.logo} alt="" />
          </div>


        </nav>
        <Dialog as="div" className="" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10 " />
          <Dialog.Panel className="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto px-0 py-0 sm:max-w-xs sm:ring-1 sm:ring-gray-900/10">

            <Card className="h-[calc(100vh)]  w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-slate-300">
              <div className="mb-2 p-4">
                <Typography variant="h5" color="blue-gray">
                  <div className='flex justify-between'>
                    ADMIN
                    <button
                      type="button"
                      className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Typography>
              </div>
              <List>
                <Link  onClick={() => setMobileMenuOpen(false) } to={'/admin/tableUser'} >
                  <ListItem>
                    <ListItemPrefix>
                      <UserIcon  strokeWidth={3} className="h-5 w-5 " />
                    </ListItemPrefix>
                    Account
                  </ListItem>
                </Link>
                <hr className="my-2 border-blue-gray-50" />

                <Link to={routs['/logout'].link}>
                  <ListItem>
                    <ListItemPrefix>
                      <PowerIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    {routs['/logout'].name}
                  </ListItem>
                </Link>
              </List>
            </Card>
          </Dialog.Panel>
        </Dialog>
      </header>
    </Affix>
  )
}