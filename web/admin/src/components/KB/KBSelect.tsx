import { KnowledgeBaseListItem } from "@/api"
import { useAppDispatch, useAppSelector } from "@/store"
import { setKbC, setKbId } from "@/store/slices/config"
import custom from '@/themes/custom'
import { Box, Button, IconButton, MenuItem, Select, Stack } from "@mui/material"
import { Ellipsis, Icon, Message } from "ct-mui"
import { useState } from "react"
import KBDelete from "./KBDelete"

const KBSelect = () => {
  const dispatch = useAppDispatch()
  const { kb_id, kbList } = useAppSelector(state => state.config)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [opraData, setOpraData] = useState<KnowledgeBaseListItem | null>(null)

  return <>
    {kbList.length > 0 && <Select
      value={kb_id}
      size='small'
      sx={{
        maxWidth: 300,
        pr: 2,
        height: 32,
        fontSize: 14,
        transition: 'all 0.3s',
        '.MuiSelect-select': {
          width: 'calc(100% + 48px)',
        },
        '&:hover': {
          transition: 'all 0.3s',
          '.icon-xiala': {
            display: 'block',
          },
        },
        '&.Mui-focused': {
          transition: 'all 0.3s',
          '.icon-xiala': {
            display: 'block',
          },
        },
      }}
      onChange={(e) => {
        if (e.target.value === kb_id || !e.target.value) return
        dispatch(setKbId(e.target.value as string))
        Message.success('切换成功')
      }}
      IconComponent={({ className, ...rest }) => {
        return <Icon
          type='icon-xiala'
          className={className + ' icon-xiala'}
          sx={{
            position: 'absolute',
            right: 0,
            fontSize: 20,
            flexShrink: 0,
            mr: 1,
            transform: className?.includes('MuiSelect-iconOpen') ? 'rotate(-180deg)' : 'none',
            transition: 'transform 0.3s',
            cursor: 'pointer',
            pointerEvents: 'none',
            display: className?.includes('MuiSelect-iconOpen') ? 'block' : 'none',
          }}
          {...rest}
        />
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            width: 300,
            maxHeight: 292,
          }
        },
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'center',
        }
      }}
    >
      <Button size='small' sx={{
        height: 40,
        mb: 0.5,
        borderRadius: '5px',
        bgcolor: 'background.paper2',
        '&:hover': {
          bgcolor: custom.selectedMenuItemBgColor,
        }
      }} fullWidth disabled={kbList.length > 0} onClick={(event) => {
        event.stopPropagation()
        dispatch(setKbC(true))
      }}
      >创建新知识库（暂不支持）</Button>
      {kbList.map(item => <MenuItem key={item.id} value={item.id} sx={{
        '&:hover .hover-del-space-icon': { display: 'block' }
      }}>
        <Stack direction={'row'} alignItems={'center'} gap={1.5} sx={{ width: '100%' }}>
          <Icon type='icon-zuzhi' sx={{ fontSize: 14, color: 'text.secondary', flexShrink: 0 }} />
          <Ellipsis>{item.name}</Ellipsis>
          <Box sx={{ width: 10 }}></Box>
          <IconButton size='small' className='hover-del-space-icon' sx={{ display: 'none' }}>
            <Icon
              type='icon-shanchu'
              sx={{ fontSize: 14, color: 'text.auxiliary', flexShrink: 0 }}
              onClick={(event) => {
                event.stopPropagation()
                setOpraData(item)
                setDeleteOpen(true)
              }}
            />
          </IconButton>
        </Stack>
      </MenuItem>)}
    </Select>}
    <KBDelete open={deleteOpen} data={opraData} onClose={() => setDeleteOpen(false)} />
  </>
}

export default KBSelect