import shutil
import os
import csv

INPUT = './../src/data/data.csv'
OUTPUT_DIR = './../src/data/processed/'
BY_COUNTRY_DIR = OUTPUT_DIR + 'by-country/'
MANIFEST_BY_COUNTRY = OUTPUT_DIR + 'manifest_by_country.csv'
BY_INDICATOR_DIR = OUTPUT_DIR + 'by-indicator/'
MANIFEST_BY_INDICATOR = OUTPUT_DIR + 'manifest_by_indicator.csv'
LATEST = OUTPUT_DIR + 'latest_all_countries.csv'


def process_data():
    if not os.path.exists(OUTPUT_DIR):
        print('# create', OUTPUT_DIR)
        os.mkdir(OUTPUT_DIR)
    else:
        print('# clear', OUTPUT_DIR)
        shutil.rmtree(OUTPUT_DIR)
        os.mkdir(OUTPUT_DIR)

    print('# create', BY_COUNTRY_DIR)
    os.mkdir(BY_COUNTRY_DIR)

    # print('# create', BY_INDICATOR_DIR)
    # os.mkdir(BY_INDICATOR_DIR)

    open(MANIFEST_BY_COUNTRY, 'w').writelines('ISO3,Name\n')

    iso = ''
    header_row = ''
    count = 0

    with open(INPUT, mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                line_count += 1
                header_row = ",".join(row)
                cols = header_row.split(',')

                #
                #   create files per indicator
                #

                # i = 0
                # for col in cols:
                #     col = col.strip()
                #     indicator_filename = BY_INDICATOR_DIR + col + '.csv'
                #     if (col != 'Name' and col != 'ISO3' and col != 'Index Year'):
                #         open(indicator_filename, 'w').writelines(
                #             'Name,ISO3,Index Year,' + cols[i])
                #     i += 1

                #
                #   create 2022 data file
                #
                open(LATEST, 'w').writelines(header_row)
            #
            #   create files per country
            #

            if (row['ISO3'] != iso):
                iso = row['ISO3']
                filename = BY_COUNTRY_DIR + str(iso) + '.csv'
                # print('\t write', filename)
                open(MANIFEST_BY_COUNTRY, 'a').writelines(
                    iso + ',' + row['Name'] + '\n')
                open(filename, 'a').writelines(header_row)

            #
            #   append country data
            #
            line = ''
            i = 0
            for col in cols:
                line += row[col]
                i += 1
                if i < len(cols):
                    line += ','
            open(filename, 'a').writelines('\n' + line)

            #
            #   append latest data
            #
            if (row['Index Year'] == '2022'):
                open(LATEST, 'a').writelines('\n' + line)

            #
            #   append per indicator data
            #

            # i = 0
            # for col in cols:
            #     indicator_filename = BY_INDICATOR_DIR + col + '.csv'
            #     if (col != 'Name' and col != 'ISO3' and col != 'Index Year'):
            #         open(indicator_filename, 'a').writelines(
            #             '\n' + row['Name'] + ',' + row['ISO3'] + ',' + row['Index Year'] + ',' + row[col])
            #     i += 1

        print('\n#write', LATEST)
        print('\n#write', MANIFEST_BY_COUNTRY)


if __name__ == "__main__":
    process_data()
