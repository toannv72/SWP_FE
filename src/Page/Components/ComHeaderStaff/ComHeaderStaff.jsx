import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import {
  Bars3Icon,
  PowerIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, } from '@heroicons/react/20/solid'
import { Link, useNavigate } from 'react-router-dom'
import { Affix } from 'antd'
import images from '../../../img'
import { routs } from '../../../constants/ROUT'
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

export default function ComHeaderStaff() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useStorage('user', {})
  const navigate = useNavigate();
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  useEffect(() => {
    if (!(user?._doc?.role === 'staff')) {

      navigate('/login')
    }
  }, []);
  return (
    <Affix offsetTop={0}>
      <header className="bg-white border-b border-gray-200  ">
        <nav className="mx-auto flex  items-center justify-between px-6 " aria-label="Global">
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
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto px-0 py-0 sm:max-w-xs sm:ring-1 sm:ring-gray-900/10">

            <Card className="h-[calc(100vh)]  w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
              <div className="mb-2 p-4">
                <Typography variant="h5" color="blue-gray">
                  Lồng chim
                </Typography>
              </div>
              <List>


                <Link to={routs['/tableOrder'].link}>
                  <ListItem>
                    <ListItemPrefix>
                      <ClipboardDocumentListIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    {routs['/tableOrder'].name}
                    <ListItemSuffix>
                      <Chip value="" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                    </ListItemSuffix>
                  </ListItem>
                </Link>

                <Link to={routs['/orderRequest'].link}>
                  <ListItem>
                    <ListItemPrefix>
                      <ClipboardDocumentListIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    {routs['/orderRequest'].name}
                    <ListItemSuffix>
                      <Chip value="" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                    </ListItemSuffix>
                  </ListItem>
                </Link>
                <Accordion
                  open={open === 3}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto h-4 w-4 transition-transform ${open === 3 ? "rotate-180" : ""}`}
                    />
                  }
                >
                  <ListItem className="p-0" selected={open === 3}>
                    <AccordionHeader onClick={() => handleOpen(3)} className="border-b-0 p-3">
                      <ListItemPrefix>
                        <ShoppingCartIcon className="h-5 w-5" />
                      </ListItemPrefix>
                      <Typography color="blue-gray" className="mr-auto font-normal">
                        Sản phẩm
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody className="py-1">
                    <List className="p-0">
                      <Link to={routs['/createProduct'].link}>
                        <ListItem>
                          <ListItemPrefix>
                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                          </ListItemPrefix>
                          {routs['/createProduct'].name}
                        </ListItem>
                      </Link>
                      <Link to={routs['/tableProduct'].link}>
                        <ListItem>
                          <ListItemPrefix>
                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                          </ListItemPrefix>
                          {routs['/tableProduct'].name}
                        </ListItem>
                      </Link>
                    </List>
                  </AccordionBody>
                </Accordion>
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

      {/* <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
        <div className="mb-2 p-4">
          <Typography variant="h5" color="blue-gray">
            Sidebar
          </Typography>
        </div>
        <List>
          <Accordion
            open={open === 1}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 1}>
              <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  Dashboard
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Analytics
                </ListItem>
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Reporting
                </ListItem>
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Projects
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
          <Accordion
            open={open === 2}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 2}>
              <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                <ListItemPrefix>
                  <ShoppingBagIcon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  E-Commerce
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Orders
                </ListItem>
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                  </ListItemPrefix>
                  Products
                </ListItem>
              </List>
            </AccordionBody>
          </Accordion>
          <hr className="my-2 border-blue-gray-50" />
          <ListItem>
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5" />
            </ListItemPrefix>
            Inbox
            <ListItemSuffix>
              <Chip value="14" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
            </ListItemSuffix>
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Profile
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Settings
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card> */}
    </Affix>
  )
}