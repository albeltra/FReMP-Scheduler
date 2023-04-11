import json
import os

from docx import Document

from docx_edit_functions import replace_match

ignore_in_sum = ['Notes', 'NOTES', 'Number', 'Location', 'Refundable Deposit']
instant_replace= ['Date', 'N', 'Name', 'Number', 'Location', 'Deposit', 'Delivery', 'Total Price']
dollars = ['Deposit', 'Delivery', 'Total Price']
headers = ['Date', 'Name', 'Number', 'Location']

prices = json.loads(open('prices/prices.txt').read())
def create_invoices(mongo_find, template_path, flag=1):
    current = list(mongo_find)
    print(len(current))
    for job in current:
        save_path = '/Invoices/' + f'Invoice {job.get("N", "")} {job.get("Name", "")} {job["Date"]} .docx'.replace('/', '+') 
        if (os.path.isfile(save_path.replace(' .docx', ' .pdf')) or os.path.isfile(save_path.replace(' .docx', '.pdf'))) and flag:
            continue
        print(job)
        running_total = 0
        for key in dollars:
            if key in job:
                try:
                    job[key] = float(job[key])
                except:
                    job[key] = ''
        del job['_id']
        template = Document(template_path)
        replace_match(template, f'%date#%', job.get('Date', ''))
        counter = 0
        for key, value in job.items():
            if key == "Same Day Pickup":
                if job[key] != '' and job[key] != 'None' and job[key] is not None:
                    replace_match(template, f'%{key}%', key)
                    replace_match(template, f'%{key}#%', '{:.2f}'.format(float(value)))
                    cur_total = float(prices[key]) * float(value)
                    running_total += cur_total
            else:
                if key in instant_replace:
                    if key in dollars:
                        if value == '' or value == 'None':
                            replace_match(template, f'%${key}%', '')
                            replace_match(template, f'%${key}#%', '')
                        else:
                            replace_match(template, f'%${key}%', key)
                            replace_match(template, f'%${key}#%', '{:.2f}'.format(value))
                    elif key =='Number' and len(job['Number']) == 10:
                        replace_match(template, f'%{key}%', key)
                        replace_match(template, f'%{key}#%', f'({value[:3]}) {value[3:6]}-{value[6:11]}')
                    else:
                        replace_match(template, f'%{key}%', key)
                        replace_match(template, f'%{key}#%', value.title() if key == 'Name' else value)
                elif key not in ignore_in_sum:
                    try:
                        cur_total = float(prices[key]) * float(value)
                    except:
                        continue
                    replace_match(template, f'%name{counter}%', key)
                    replace_match(template, f'%value{counter}%', value)
                    replace_match(template, f'%price{counter}%', prices[key])
                    replace_match(template, f'%total{counter}%', '{:.2f}'.format(cur_total))
                    running_total += cur_total
                    counter += 1

        if job.get("Same Day Pickup") == '' or job.get("Same Day Pickup") == 'None' or job.get("Same Day Pickup") is None:
            replace_match(template, f'%Same Day Pickup%', '')
            replace_match(template, f'%Same Day Pickup#%', '') 

        #     else:
        #         replace_match(template, f'%Same Day Pickup%', 'Same Day Pickup')

        for key in headers:
            replace_match(template, f'%{key}%', '')
            replace_match(template, f'%{key}#%', '')

        for ind in range(counter, 14):
            replace_match(template, f'%name{ind}%', '')
            replace_match(template, f'%value{ind}%', '')
            replace_match(template, f'%price{ind}%', '')
            replace_match(template, f'%total{ind}%', '')

        keys = job.keys()
        job['Total Price'] = 0 if isinstance(job.get('Total Price', ''), str) else job['Total Price']
        total_due = job['Total Price']
        replace_match(template, f'%Total Price#%', '{:.2f}'.format(total_due))
        if 'Deposit' in keys:
            # if isinstance(job['Deposit'], str):
            if job['Deposit'] != '' and job['Deposit'] != 'None' and job['Deposit'] is not None:
                total_due -= float(job['Deposit'])
                replace_match(template, f'%Deposit%', 'Deposit')
                replace_match(template, f'%Deposit#%', '${:.2f}'.format(job['Deposit']))
            else:
                 replace_match(template, f'%Deposit%', '')
                 replace_match(template, f'%Deposit#%', '')
        else:
            replace_match(template, f'%Deposit%', '')
            replace_match(template, f'%Deposit#%', '')
        replace_match(template, f'%Total Due#%', '{:.2f}'.format(total_due))
        if 'Delivery' in keys:
            # if isinstance(job['Delivery'], str):
            if job['Delivery'] != '' and job['Delivery'] != 'None' and job['Delivery'] is not None:
                running_total += float(job['Delivery'])
                replace_match(template, f'%Delivery%', 'Delivery')
                replace_match(template, f'%Delivery#%', '{:.2f}'.format(job['Delivery']))
            else:
                replace_match(template, f'%Delivery%', '')
                replace_match(template, f'%Delivery#%', '')
        else:
            replace_match(template, f'%Delivery%', '')
            replace_match(template, f'%Delivery#%', '')
        if running_total < job['Total Price']:
            misc = float(job['Total Price']) - running_total
            replace_match(template, f'%Miscellaneous%', 'Miscellaneous')
            replace_match(template, f'%Miscellaneous#%', '{:.2f}'.format(misc))
        elif running_total > job['Total Price']:
            discount = running_total - float(job['Total Price'])
            replace_match(template, f'%Miscellaneous%', 'Discount')
            replace_match(template, f'%Miscellaneous#%', '-{:.2f}'.format(discount))
        else:
            replace_match(template, f'%Miscellaneous%', '')
            replace_match(template, f'%Miscellaneous#%', '')

        template.save(save_path)
        os.system(f'doc2pdf "{save_path}" && rm "{save_path}"')
